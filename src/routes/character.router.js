import express from 'express';
import { prisma } from '../utils/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
// 캐릭터 생성
router.post('/new', authMiddleware, async (req, res, next) => {
    const {userId} = req.user; //유저아이디 확인
    const {char_name} = req.body; //캐릭터명 입력
//캐릭터명 중복 확인
    const isExistChar = await prisma.character.findFirst({
        where: {
          char_name
        },
      });
    
      if (isExistChar) {
        return res.status(409).json({ message: '이미 존재하는 이름입니다.' });
      }
    

    const post = await prisma.character.create({
        data: {
            userId: +userId,
            char_name,
            char_health : 500,
            char_power : 100,
            char_money : 10000,
        },
    });

    return res.status(201).json({ message: '캐릭터 생성이 완료되었습니다.'});
});

//캐릭터 삭제
router.delete('/delete', authMiddleware, async (req, res, next) => {
    const {userId} = req.user; //유저아이디 확인
    const {char_name} = req.body; //캐릭터명 입력

    const del = await prisma.character.findFirst({
        where: {
            char_name
        },
    });

    if (!del) {
        return res.status(404).json({ message: '존재하지 않는 캐릭터명입니다.' });
      }

      await prisma.character.delete({
        where: {
            char_id: del.char_id,
        }
      })

    return res.status(201).json({ message: '캐릭터가 삭제되었습니다.'});
});

export default router;