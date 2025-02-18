import { Router } from 'express';

import { AuthAdmin, AuthUserOrAdmin } from '../middleware/auth.js';

import * as userController from '../controllers/user.controller.js';
import * as teamController from '../controllers/voucher.controller.js';

const router = Router();

// User routes
router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);

// Admin routes
router.route('/voucher').post(AuthAdmin, teamController.addVoucher);
router.route('/voucher/:id').put(AuthAdmin, teamController.updateVoucher);
router.route('/voucher/:id').delete(AuthAdmin, teamController.deleteVoucher);
router.route('/vouchers').get(AuthUserOrAdmin, teamController.getVouchers);
router.route('/voucher/:id').get(AuthUserOrAdmin, teamController.getVoucherById);

export default router;
