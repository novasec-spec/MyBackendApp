const { query } = require('../config/database');
const { logger } = require('../utils/logger');

class AuditMiddleware {
  static log(action, resource, resourceId = null, changes = null, metadata = null) {
    return async (req, res, next) => {
      const originalJson = res.json;
      
      res.json = function(data) {
        // Only log if response was successful
        if (data && data.success) {
          const userId = req.user?.id || null;
          
          const auditData = {
            user_id: userId,
            action,
            resource,
            resource_id: resourceId || req.params.id || req.body.id || null,
            ip_address: req.ip || req.connection.remoteAddress,
            user_agent: req.headers['user-agent'] || null,
            changes: changes ? JSON.stringify(changes) : null,
            metadata: metadata ? JSON.stringify(metadata) : {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode
            }
          };

          // Fire and forget - don't await to not block response
          query(
            `INSERT INTO audit_logs 
             (user_id, action, resource, resource_id, ip_address, user_agent, changes, metadata)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              auditData.user_id,
              auditData.action,
              auditData.resource,
              auditData.resource_id,
              auditData.ip_address,
              auditData.user_agent,
              auditData.changes,
              auditData.metadata
            ]
          ).catch(err => {
            logger.error('Failed to create audit log:', err);
          });
        }
        
        originalJson.call(this, data);
      };
      
      next();
    };
  }

  static withLog(action, resource, getResourceId = null, getChanges = null, getMetadata = null) {
    return (req, res, next) => {
      const resourceId = getResourceId ? getResourceId(req) : null;
      const changes = getChanges ? getChanges(req) : null;
      const metadata = getMetadata ? getMetadata(req) : null;
      
      return this.log(action, resource, resourceId, changes, metadata)(req, res, next);
    };
  }
}

module.exports = { AuditMiddleware };
