import { Server } from "socket.io";
import { messageServices } from "./chats.services";

const initialChats = (io: Server) => {
    const chatNamespace = io.of('/live-chats');

    chatNamespace.on('connection', (socket) => {

        console.log(`User connected: ${socket.id}`);
        //receive using on send using emit
        socket.on("sendUser", async (data) => {
            try {
                console.log(data);
  
                const dbMessage = await messageServices.createMessage(data);
                console.log('after db', dbMessage);
                if (dbMessage) {
                    socket.emit(`received${dbMessage?.sender}`, dbMessage);
                    socket.emit(`received${dbMessage?.receiver}`, dbMessage);
                } else {
                    console.error("Message missing!");
                }
            } catch (error) {
                console.error("Error in sending message:", error);
            }
        });

        // message with all admin
        socket.on("sendAdmin", async (data) => {
            try {
                const dbMessage = await messageServices.createAdminMessage(data);

                if (dbMessage) {
                    socket.emit(`receivedAdmin${dbMessage?.sender}`, { message: data });
                    socket.emit(`receivedAdmin${dbMessage?.receiver}`, { message: data });
                } else {
                    console.error("Message missing!");
                }
            } catch (error) {
                console.error("Error in sending message:", error);
            }
        })

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            // You can perform any cleanup or logging here
        });
    });
};

export default initialChats;
