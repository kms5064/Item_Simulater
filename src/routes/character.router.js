import express from 'express';
import { prisma } from '../utils/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/new', authMiddleware, async (req, res, next) => {
    const {userId} = req.user;
    const {char_name} = req.body;

    const isExistChar = await prisma.character.findFirst({
        where: {
          char_name,
        },
      });
    
      if (isExistChar) {
        return res.status(409).json({ message: '이미 존재하는 이름입니다.' });
      }
    

    const post = await prisma.character.create({
        data: {
            userId: +userId,
            char_name: 
            content,
        },
    });

    return res.status(201).json({ data: post});
});


export default router;