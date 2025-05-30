import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { chatroomController } from '../controllers/chatroomController.js';

const router = express.Router();

// Tüm route'lar için authentication gerekli
router.use(authenticateToken);

// Chatroom routes
router.get('/', chatroomController.getAllChatrooms);
router.get('/user/:userId', chatroomController.getUserChatrooms);
router.post('/', chatroomController.createChatroom);
router.post('/:chatroomId/join', chatroomController.joinChatroom);
router.get('/:chatroomId/messages', chatroomController.getChatroomMessages);
router.post('/:chatroomId/messages', chatroomController.sendMessage);
router.delete('/:chatroomId', chatroomController.deleteChatroom);

export default router; 