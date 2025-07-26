// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'memory';

export const getAllMemories = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: 'Name' } },
        { field: { Name: 'content' } },
        { field: { Name: 'type' } },
        { field: { Name: 'mood' } },
        { field: { Name: 'timestamp' } },
        { field: { Name: 'reactions' } },
        { field: { Name: 'Tags' } },
        { field: { Name: 'userId' } }
      ],
      orderBy: [
        {
          fieldName: 'timestamp',
          sorttype: 'DESC'
        }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error("Error fetching memories:", response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching memories:", error?.response?.data?.message);
    } else {
      console.error("Error fetching memories:", error.message);
    }
    throw error;
  }
};

export const getMemoryById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: 'Name' } },
        { field: { Name: 'content' } },
        { field: { Name: 'type' } },
        { field: { Name: 'mood' } },
        { field: { Name: 'timestamp' } },
        { field: { Name: 'reactions' } },
        { field: { Name: 'Tags' } },
        { field: { Name: 'userId' } }
      ]
    };

    const response = await apperClient.getRecordById(tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(`Error fetching memory with ID ${id}:`, response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("Memory not found");
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching memory with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(`Error fetching memory with ID ${id}:`, error.message);
    }
    throw error;
  }
};

export const createMemory = async (memoryData) => {
  try {
    // Only include updateable fields
    const updateableData = {
      Name: memoryData.content?.substring(0, 50) || 'Memory',
      content: memoryData.content,
      type: memoryData.type || 'text',
      mood: memoryData.mood || 'default',
      timestamp: new Date().toISOString(),
      reactions: Array.isArray(memoryData.reactions) ? memoryData.reactions.join(',') : '',
      Tags: Array.isArray(memoryData.tags) ? memoryData.tags.join(',') : '',
      userId: parseInt(memoryData.userId || 1)
    };

    const params = {
      records: [updateableData]
    };

    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error creating memory:", response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create memories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating memory:", error?.response?.data?.message);
    } else {
      console.error("Error creating memory:", error.message);
    }
    throw error;
  }
};

export const updateMemory = async (id, updates) => {
  try {
    // Only include updateable fields
    const updateableData = {
      Id: parseInt(id)
    };
    
    const allowedFields = ['Name', 'content', 'type', 'mood', 'timestamp', 'reactions', 'Tags', 'userId'];
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'reactions' && Array.isArray(updates[key])) {
          updateableData[key] = updates[key].join(',');
        } else if (key === 'tags') {
          updateableData.Tags = Array.isArray(updates[key]) ? updates[key].join(',') : updates[key];
        } else if (key === 'userId') {
          updateableData[key] = parseInt(updates[key]);
        } else {
          updateableData[key] = updates[key];
        }
      }
    });

    const params = {
      records: [updateableData]
    };

    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error updating memory:", response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update memories ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          record.errors?.forEach(error => {
            throw new Error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating memory:", error?.response?.data?.message);
    } else {
      console.error("Error updating memory:", error.message);
    }
    throw error;
  }
};

export const deleteMemory = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error deleting memory:", response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete memories ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulDeletions.length > 0;
    }

    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting memory:", error?.response?.data?.message);
    } else {
      console.error("Error deleting memory:", error.message);
    }
    throw error;
  }
};