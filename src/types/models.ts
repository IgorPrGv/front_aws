// src/types/models.ts

// Usuário
export type User = {
  id: string;                         
  username: string;
  userType: "PLAYER" | "DEV";         
  createdAt: string;                  
};

export type GameImage = {
  id: string;                         
  gameId: string;                     
  imagePath: string;                  
  orderIndex: number;
};

// Jogo 
export type Game = {
  id: string;                         
  developerId: string;                
  title: string;
  description: string;
  genre: string;
  filePath?: string | null;           
  createdAt: string;                  
  likes: number;                      
  dislikes: number;
  images: GameImage[];
  downloads?: number;                 
};

export type Downloads = {
  id: string;                         
  gameId: string;                     
  userId: string;                     
  addedAt: string;                    
  
};


// Review no DynamoDB
export type Review = {
  reviewId: string;
  gameId: string;
  userId: string;
  comment: string;
  createdAt: string;                  
  author?: Pick<User, "id" | "username">;
};

// Reaction/Rating no DynamoDB
export type Reaction = {
  gameId: string;
  userId: string;
  isLike: boolean;                    
  updatedAt: string;                  
};
