import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import router from './app/routes'
import notFound from './app/middlewares/notFound'
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import { createServer } from 'http';
import { Server } from 'socket.io';
import initialChats from './app/modules/chats/chats.socket';
import path from 'path';
const app: Application = express()


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['*','https://morfitter-frontend.vercel.app', 'https://morfitter-frontend-six.vercel.app', 'http://localhost:3000','https://morfitter-frontend-2ri70yisw-thrajus-projects.vercel.app', 'https://morfitter-frontend-2ri70yisw-thrajus-projects.vercel.app', 'https://morfitter-frontend-nmovhie9i-thrajus-projects.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

initialChats(io)
app.set("io",io)

const corsOptions = {
  origin: ['https://morfitter-frontend.vercel.app', 'https://morfitter-frontend-six.vercel.app', 'http://localhost:3000','https://morfitter-frontend-2ri70yisw-thrajus-projects.vercel.app', 'https://morfitter-frontend-2ri70yisw-thrajus-projects.vercel.app', 'https://morfitter-frontend-nmovhie9i-thrajus-projects.vercel.app'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
};
// parser
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser());
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/v1', router)

app.use(globalErrorHandler)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})
app.use(notFound)

// export default app
export default httpServer
