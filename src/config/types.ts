import { UserCredential } from "firebase/auth";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export interface RepDetailsModalProps extends ModalProps {
  id: string;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
}

export interface UniversalModalProps {
  open: boolean;
  onClose: () => void;
  handleYes: () => void;
  title: string;
}
export interface LoggedUserState {
  items: {
    email: string;
    id: string;
    image: string;
  };
}

export interface TokenResponse {
  firstName?: string;
  lastName?: string;
}

export interface CustomUserCredential extends UserCredential {
  _tokenResponse?: TokenResponse;
}

export interface ProductType {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export interface ProductProps {
  fetchProducts: () => void;
}

export interface FilterState {
  items: any[];
}
interface Specification {
  [key: string]: string | number;
}

export interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  description: string;
  specifications: Specification[];
  owner: {
    _id: string;
    username: string;
    verification: boolean;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    image: string;
    location: {
      state: string;
      city: string;
    };
  };
  createdAt: string;
  views: number;
}

export interface Specifications {
  id: number;
  spec: string;
  value: string;
}

export interface ProductData {
  name: string;
  price: number;
  quantity: number;
  status: string;
  views: number;
  description: string;
  image: string | null;
  specifications: Record<string, string>;
}
