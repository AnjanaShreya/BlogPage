const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Validates whether a string is a valid UUID
 * Used to replace mongoose.Types.ObjectId.isValid()
 */
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUUID(id) {
  if (!id) return false;
  return uuidRegex.test(id);
}

/**
 * Format Prisma object or array to match MongoDB response formats (mapping id to _id)
 * This guarantees backward compatibility with the React frontend without touching the frontend code.
 */
function formatPrisma(data) {
  if (data === null || data === undefined) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => formatPrisma(item));
  }
  
  if (typeof data === 'object') {
    // If it's a Date object, keep it
    if (data instanceof Date) return data;
    
    const formatted = {};
    for (const key in data) {
      if (key === 'id') {
        formatted._id = data.id;
        formatted.id = data.id; // Provide both just in case
      } else {
        formatted[key] = formatPrisma(data[key]);
      }
    }
    
    // Ensure _id exists if id exists
    if (data.id && !data._id) {
      formatted._id = data.id;
    }
    
    return formatted;
  }
  
  return data;
}

module.exports = {
  prisma,
  isValidUUID,
  formatPrisma
};
