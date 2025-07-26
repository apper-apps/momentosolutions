// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'app_User';

export const getCurrentUser = async () => {
  try {
    const params = {
      fields: [
        { field: { Name: 'Name' } },
        { field: { Name: 'email' } },
        { field: { Name: 'streakCount' } },
        { field: { Name: 'xpPoints' } },
        { field: { Name: 'level' } },
        { field: { Name: 'badges' } },
        { field: { Name: 'subscriptionStatus' } },
        { field: { Name: 'dailyChatCount' } },
        { field: { Name: 'lastActive' } }
      ],
      pagingInfo: {
        limit: 1,
        offset: 0
      }
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error("Error fetching current user:", response.message);
      throw new Error(response.message);
    }

    if (!response.data || response.data.length === 0) {
      throw new Error("No user found");
    }

    return response.data[0];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching current user:", error?.response?.data?.message);
    } else {
      console.error("Error fetching current user:", error.message);
    }
    throw error;
  }
};

export const updateUserStats = async (userId, updates) => {
  try {
    // Only include updateable fields
    const updateableData = {};
    const allowedFields = ['Name', 'email', 'streakCount', 'xpPoints', 'level', 'badges', 'subscriptionStatus', 'dailyChatCount', 'lastActive'];
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateableData[key] = updates[key];
      }
    });

    // Update level based on XP if xpPoints is being updated
    if (updateableData.xpPoints) {
      updateableData.level = Math.floor(updateableData.xpPoints / 1000) + 1;
    }

    const params = {
      records: [{
        Id: parseInt(userId),
        ...updateableData
      }]
    };

    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error updating user stats:", response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update user stats ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
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
      console.error("Error updating user stats:", error?.response?.data?.message);
    } else {
      console.error("Error updating user stats:", error.message);
    }
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    // Only include updateable fields
    const updateableData = {};
    const allowedFields = ['Name', 'email', 'streakCount', 'xpPoints', 'level', 'badges', 'subscriptionStatus', 'dailyChatCount', 'lastActive'];
    
    Object.keys(profileData).forEach(key => {
      if (allowedFields.includes(key)) {
        updateableData[key] = profileData[key];
      }
    });

    const params = {
      records: [{
        Id: parseInt(userId),
        ...updateableData
      }]
    };

    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error("Error updating user profile:", response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update user profile ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
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
      console.error("Error updating user profile:", error?.response?.data?.message);
    } else {
      console.error("Error updating user profile:", error.message);
    }
    throw error;
}
};