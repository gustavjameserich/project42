import { 
  User, InsertUser, 
  Course, InsertCourse,
  Subscription, InsertSubscription,
  UserCourse, InsertUserCourse
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  
  // UserCourse operations (one-time purchases)
  getUserCourses(userId: number): Promise<Course[]>;
  createUserCourse(userCourse: InsertUserCourse): Promise<UserCourse>;
  
  // Subscription operations
  getUserSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  // Session storage
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private userCourses: Map<number, UserCourse>;
  private subscriptions: Map<number, Subscription>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private courseIdCounter: number;
  private userCourseIdCounter: number;
  private subscriptionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.userCourses = new Map();
    this.subscriptions = new Map();
    
    this.userIdCounter = 1;
    this.courseIdCounter = 1;
    this.userCourseIdCounter = 1;
    this.subscriptionIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24h
    });
    
    // Seed courses
    this.seedCourses();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  // UserCourse operations
  async getUserCourses(userId: number): Promise<Course[]> {
    const userCourseEntries = Array.from(this.userCourses.values())
      .filter(uc => uc.userId === userId);
    
    return userCourseEntries.map(uc => this.courses.get(uc.courseId)!)
      .filter(Boolean);
  }
  
  async createUserCourse(insertUserCourse: InsertUserCourse): Promise<UserCourse> {
    const id = this.userCourseIdCounter++;
    const userCourse: UserCourse = {
      ...insertUserCourse,
      id,
      purchasedAt: new Date()
    };
    this.userCourses.set(id, userCourse);
    return userCourse;
  }
  
  // Subscription operations
  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId && sub.active);
  }
  
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    // Check if user already has an active subscription
    const existingSubscription = await this.getUserSubscription(insertSubscription.userId);
    
    if (existingSubscription) {
      // Deactivate existing subscription
      existingSubscription.active = false;
      this.subscriptions.set(existingSubscription.id, existingSubscription);
    }
    
    const id = this.subscriptionIdCounter++;
    const subscription: Subscription = {
      ...insertSubscription,
      id
    };
    
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  
  // Seed database with initial courses
  private seedCourses() {
    const courses: Omit<Course, 'id'>[] = [
      {
        title: "Full-Stack Web Development",
        description: "Master both frontend and backend technologies. Build complete web applications from scratch with modern JavaScript frameworks.",
        price: 12999, // in cents ($129.99)
        duration: 60, // in hours
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        rating: 45, // 4.5 out of 5
        reviewCount: 1234,
        featured: true,
        isNew: false,
        isBestseller: true
      },
      {
        title: "React & Redux Masterclass",
        description: "Learn to build complex, scalable user interfaces with React and manage application state with Redux.",
        price: 8999, // in cents ($89.99)
        duration: 40,
        imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
        rating: 50, // 5.0 out of 5
        reviewCount: 897,
        featured: false,
        isNew: false,
        isBestseller: false
      },
      {
        title: "Backend Development with Node.js",
        description: "Build scalable APIs and server-side applications with Node.js. Includes Express, MongoDB, and authentication.",
        price: 9999, // in cents ($99.99)
        duration: 50,
        imageUrl: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613",
        rating: 40, // 4.0 out of 5
        reviewCount: 456,
        featured: false,
        isNew: true,
        isBestseller: false
      },
      {
        title: "Advanced JavaScript Concepts",
        description: "Deep dive into JavaScript's advanced features: closures, prototypes, async/await, generators, and more.",
        price: 7999, // in cents ($79.99)
        duration: 35,
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        rating: 45, // 4.5 out of 5
        reviewCount: 723,
        featured: true,
        isNew: false,
        isBestseller: false
      },
      {
        title: "Modern CSS & SASS",
        description: "Master modern CSS techniques, Flexbox, Grid, CSS variables, and SASS to create responsive and beautiful designs.",
        price: 6999, // in cents ($69.99)
        duration: 30,
        imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2",
        rating: 45, // 4.5 out of 5
        reviewCount: 512,
        featured: false,
        isNew: false,
        isBestseller: false
      },
      {
        title: "TypeScript for Professionals",
        description: "Learn how to leverage TypeScript to build robust, type-safe applications and improve your development workflow.",
        price: 8499, // in cents ($84.99)
        duration: 45,
        imageUrl: "https://images.unsplash.com/photo-1607798748738-b15c40d33d57",
        rating: 45, // 4.5 out of 5
        reviewCount: 345,
        featured: false,
        isNew: true,
        isBestseller: false
      }
    ];
    
    courses.forEach(course => {
      const id = this.courseIdCounter++;
      this.courses.set(id, { ...course, id });
    });
  }
}

export const storage = new MemStorage();
