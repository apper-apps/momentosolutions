import userData from "@/services/mockData/users.json";

const delay = () => new Promise(resolve => setTimeout(resolve, 300));

export const getCurrentUser = async () => {
  await delay();
  return { ...userData[0] };
};

export const updateUserStats = async (userId, updates) => {
  await delay();
  const user = { ...userData[0] };
  
  // Update user stats
  Object.keys(updates).forEach(key => {
    if (user.hasOwnProperty(key)) {
      user[key] = updates[key];
    }
  });
  
  // Update level based on XP
  user.level = Math.floor(user.xpPoints / 1000) + 1;
  
  return user;
};

export const updateUserProfile = async (userId, profileData) => {
  await delay();
  const user = { ...userData[0] };
  
  Object.keys(profileData).forEach(key => {
    if (user.hasOwnProperty(key)) {
      user[key] = profileData[key];
    }
  });
  
  return user;
};