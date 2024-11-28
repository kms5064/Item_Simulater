import express from 'express';
import { prisma } from '../utils/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
// 아이템 생성
router.post('/newitem', async (req, res, next) => {
    const {item_code, item_name, item_stat, item_price} = req.body;
//아이템명 중복 확인
    const isExistItem = await prisma.items.findFirst({
        where: {
          item_code
        },
      });
    
      if (isExistItem) {
        return res.status(409).json({ message: '이미 존재하는 아이템 코드입니다.' });
      }
    

    const newItem = await prisma.items.create({
        data: {
            item_code, 
            item_name, 
            item_stat: item_stat, 
            item_price
        },
    });

    return res.status(201).json({ message: '아이템 생성이 완료되었습니다.'});
});
//아이템 수정
router.put('/fixitem/:item_code', async (req, res, next) => {
    const {item_code} = req.params;
    const {item_name, item_stat} = req.body;
//아이템 코드 숫자열로
    const int = Number(item_code);
//아이템코드 확인
    const isExistItem = await prisma.items.findFirst({
        where: {
          item_code : int
        },
      });
    
      if (!isExistItem) {
        return res.status(409).json({ message: '아이템을 찾을 수 없습니다.' });
      }
      
      await prisma.items.update({
        where: {
            item_code : int
        },
        data: {
            item_name: item_name,
            item_stat: item_stat
        }
      });

      return res.status(201).json({ message: '아이템 정보가 수정되었습니다.'}); 
})

//아이템 목록 조회
router.get('/itemlist', async (req, res, next) => {
    const posts = await prisma.items.findMany({
      select: {
        item_code: true,
        item_name: true,
        item_stat: true,
        item_price: true,
      },
      orderBy: {
        item_code: 'asc', //아이템 코드로 정렬
      },
    });
  
    return res.status(200).json({ data: posts });
  });

  //아이템 상세 조회
router.get('/checkitem/:item_code', async (req, res, next) => {
    const { item_code } = req.params;
//아이템 코드 숫자열로
    const int = Number(item_code);
    //아이템 코드 확인
    const isExistItem = await prisma.items.findFirst({
        where: {
          item_code : int
        },
      });
    
      if (!isExistItem) {
        return res.status(404).json({ message: '아이템을 찾을 수 없습니다.' });
      }
      //체크
    const check = await prisma.items.findFirst({
      where: {
        item_code : int
      },
      select: {
        item_code: true, 
        item_name: true,
        item_stat: true,
        item_price: true
      }
    });
    
    return res.status(200).json({ data: check })
    
  });


export default router;