export interface IUser {
    email: string;
    username?: string;
    password: string;
    imgUrl?: string;
    phoneNumber?: string;
    fullName?: string;
    _id?: string;
    accessToken?: string;
    refreshToken?: string;
  }
  
  export interface IRealEstate {
    city: string;
    address: string;
    owner: string;
    description: string;
    area: string;
    location: string;
    _id: string;
  }

  
export interface IPost {
    _id: string;
    user: string; 
    realestate: string; 
    sender?: IUser;
    realEstateDetails?: IRealEstate; 
  }
  