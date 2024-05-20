# X-Twitter-Clone

Welcome to X-Twitter-Clone, a project aimed at creating a clone of the popular social media platform Twitter.

## Overview

X-Twitter-Clone is built using modern web technologies and follows a full-stack architecture. The backend is developed with Node.js, GraphQL, Next.js, Prisma OR, PostgreSQL, TypeScript, and AWS. The frontend is developed with Next.js and React.

## Features

### User Authentication via Google OAuth
Implemented Google OAuth authentication using React GoogleAuth, allowing users to securely log in to the Twitter application. This authentication method leverages Google's OAuth 2.0 protocol, enabling seamless sign-in with Google accounts without sharing passwords. Upon successful authentication, users gain access to the application's features and functionalities.

### Tweeting Functionality with Image Support
Enabled users to create tweets with support for attaching images, enriching the platform's interactivity and engagement. Users can compose and publish tweets containing text content along with optional image attachments. This feature enhances the user experience by allowing the sharing of visual content alongside messages, making tweets more expressive and captivating.

### User Recommendation System based on Follows
Implemented a user recommendation system that suggests relevant accounts for users to follow, leveraging GraphQL to analyze a user's follow list and identify accounts frequently followed by users with similar interests or connections. By recommending relevant accounts, the system fosters community interaction and connection, facilitating the discovery of new content and users within the Twitter community.

### Efficient Data Caching with Redis
Implemented Redis caching to optimize application performance by storing frequently accessed data, such as user profiles and tweet feeds. By caching data in Redis, the application reduces the need for repeated database queries, resulting in improved response times and smoother user experiences. Redis serves as an in-memory data store, enabling quick retrieval and serving of cached data to users, thereby minimizing latency and enhancing scalability.

### Storage and Deployment with AWS Services
Utilized AWS services such as EC2, Nginx, ALB (Application Load Balancer), and CloudFront for storage and deployment of the Twitter application. EC2 instances provide scalable compute capacity for hosting the backend services, while Nginx acts as a reverse proxy for handling incoming HTTP requests. ALB ensures high availability and distributes incoming traffic across multiple EC2 instances, while CloudFront delivers content to users with low latency and high data transfer speeds. This deployment architecture ensures scalability, reliability, and optimal performance of the Twitter application, even under heavy loads and varying traffic patterns.

## Getting Started

### Prerequisites

Ensure you have the following software installed on your machine:

- Node.js (v14.x or higher)
- Yarn package manager
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rithik53/X-Twitter--Clone.git
```
2. Navigate to the project directory:
```bash
cd twitter-server
```
3. Install backend dependencies:
```bash
cd server
yarn install
```


4. Install frontend dependencies:

```bash
cd ../twitter-client
yarn install
```
## Configuration

### Update .env File

1. Navigate to the `twitter-server` directory.

2. Copy the `.env.example` file and rename it to `.env`.

3. Replace the placeholder values in the `.env` file with your actual credentials:

   - Obtain the Redis key from Upstash and replace `REDIS_KEY_HERE` with the actual key.
   - Obtain the AWS credentials (S3 key, access key, secret key, default region) and replace the placeholders accordingly.
   - Obtain the Supabase database key and replace `DATABASE_KEY_HERE` with the actual key.

4. Save the `.env` file.


## Running the Application

1. Start the backend server:
```bash
cd ../twitter-server
yarn dev
```

The backend server will be accessible at: [http://localhost:8000](http://localhost:8000)

2. Start the frontend development server:
```bash
cd ../twitter-client
yarn dev
```

The frontend development server will be accessible at: [http://localhost:3000](http://localhost:3000)

## Usage

You can now access the X-Twitter-Clone application by visiting [http://localhost:3000](http://localhost:3000) in your web browser. Sign up or log in to start tweeting and interacting with other users!

## Contributing

We welcome contributions from the community! If you have any ideas, bug fixes, or feature enhancements, feel free to open an issue or submit a pull request.



