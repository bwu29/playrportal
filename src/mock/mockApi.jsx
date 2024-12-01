export const mockLogin = (username, password) => {
    const users = [
      { username: "player1", password: "1234", role: "player" },
      { username: "club1", password: "abcd", role: "club" },
    ];
  
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "Invalid credentials" };
    }
  };
  
  export const mockSignup = (username, password, role) => {
    return { success: true, user: { username, role } }; // Mock success
  };
  