// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'capsule';

export const getAllCapsules = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: 'Name' } },
        { field: { Name: 'message' } },
        { field: { Name: 'unlockDate' } },
        { field: { Name: 'recipientEmail' } },
        { field: { Name: 'isUnlocked' } },
        { field: { Name: 'createdAt' } },
        { field: { Name: 'Tags' } },
        { field: { Name: 'userId' } }
      ],
      orderBy: [
        {
          fieldName: 'unlockDate',
          sorttype: 'ASC'
        }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error("Error fetching capsules:", response.message);
      throw new Error(response.message);
    }

    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching capsules:", error?.response?.data?.message);
    } else {
      console.error("Error fetching capsules:", error.message);
    }
    throw error;
  }
};

export const getCapsuleById = async (id) => {
  try {
    const params = {
      fields: [
        { field: { Name: 'Name' } },
        { field: { Name: 'message' } },
        { field: { Name: 'unlockDate' } },
        { field: { Name: 'recipientEmail' } },
        { field: { Name: 'isUnlocked' } },
        { field: { Name: 'createdAt' } },
        { field: { Name: 'Tags' } },
        { field: { Name: 'userId' } }
      ]
    };

    const response = await apperClient.getRecordById(tableName, parseInt(id), params);
    
    if (!response.success) {
      console.error(`Error fetching capsule with ID ${id}:`, response.message);
      throw new Error(response.message);
    }

    if (!response.data) {
      throw new Error("Capsule not found");
    }

    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching capsule with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(`Error fetching capsule with ID ${id}:`, error.message);
    }
    throw error;
  }
};

export const createCapsule = async (capsuleData) => {
  try {
    // Only include updateable fields
    const updateableData = {
      Name: capsuleData.message?.substring(0, 50) || 'Time Capsule',
      message: capsuleData.message,
      unlockDate: capsuleData.unlockDate,
      recipientEmail: capsuleData.recipientEmail || null,
      isUnlocked: capsuleData.isUnlocked || false,
      createdAt: new Date().toISOString(),
      Tags: Array.isArray(capsuleData.tags) ? capsuleData.tags.join(',') : '',
      userId: parseInt(capsuleData.userId || 1)
    };

    const params = {
      records: [updateableData]
    };

    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error creating capsule:", response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create capsules ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
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
      console.error("Error creating capsule:", error?.response?.data?.message);
    } else {
      console.error("Error creating capsule:", error.message);
    }
    throw error;
  }
};

export const updateCapsule = async (id, updates) => {
  try {
    // Only include updateable fields
    const updateableData = {
      Id: parseInt(id)
    };
    
    const allowedFields = ['Name', 'message', 'unlockDate', 'recipientEmail', 'isUnlocked', 'createdAt', 'Tags', 'userId'];
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        if (key === 'tags') {
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
      console.error("Error updating capsule:", response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update capsules ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
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
      console.error("Error updating capsule:", error?.response?.data?.message);
    } else {
      console.error("Error updating capsule:", error.message);
    }
    throw error;
  }
};

export const deleteCapsule = async (id) => {
  try {
    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error deleting capsule:", response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete capsules ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulDeletions.length > 0;
    }

    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting capsule:", error?.response?.data?.message);
    } else {
      console.error("Error deleting capsule:", error.message);
    }
    throw error;
  }
};