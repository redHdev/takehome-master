import { Router } from 'express';
import IRoute from '../types/IRoute';
import { User } from '../services/db';
import { Op } from 'sequelize';

const UsersRouter: IRoute = {
  route: '/users',
  router() {
    const router = Router();

    router.route('/')
      // Fetch all users
      .get(async (req, res) => {
        // pro tip: if you're not seeing any users, make sure you seeded the database.
        //          make sure you read the readme! :)

        try {
          const {
            search,
            sortBy,
            order = 'asc',
            limit = '15',
            after
          } = req.query;

          console.log(after);

          let whereCondition: any = {};  // We'll build the condition dynamically.

          if (search) {
            whereCondition = {
              [Op.or]: [
                { firstName: { [Op.like]: `%${search}%` } },
                { middleName: { [Op.like]: `%${search}%` } },
                { lastName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
              ]
            };
          }

          if (after) {
            whereCondition.id = { [Op.gt]: Number(after) };
          }

          const users: User[] = await User.findAll({
            where: whereCondition,
            order: sortBy ? [[sortBy, order]] : undefined,
            limit: Number(limit) + 1
          });

          let hasMore = false;
          if (users.length > Number(limit)) {
            hasMore = true;
            users.pop();
          }

          res.json({
            success: true,
            data: users,
            hasMore
          });

        } catch (err) {
          console.error('Failed to list users.', err);
          res.status(500).json({
            success: false,
            message: 'Failed to list users.',
          });
        }
      })
    // Create a new user
    .post(async (req, res) => {
      try {
        console.log(req.body, "SERVER");
        const user = await User.create(req.body);
        res.status(201).json({
          success: true,
          data: user,
        });
      } catch (err) {
        console.error('Failed to create user.', err);
        res.status(500).json({
          success: false,
          message: 'Failed to create user.',
        });
      }
    });

  router.route('/:id')
    // Fetch a single user by ID
    .get(async (req, res) => {
      try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found.',
          });
        }
        res.json({
          success: true,
          data: user,
        });
      } catch (err) {
        console.error('Failed to retrieve user.', err);
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve user.',
        });
      }
    })

    // Update a user by ID
    .put(async (req, res) => {
      try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found.',
          });
        }
        await user.update(req.body);
        res.json({
          success: true,
          data: user,
        });
      } catch (err) {
        console.error('Failed to update user.', err);
        res.status(500).json({
          success: false,
          message: 'Failed to update user.',
        });
      }
    })

    // Delete a user by ID
    .delete(async (req, res) => {
      try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found.',
          });
        }
        await user.destroy();
        res.json({
          success: true,
          message: 'User deleted successfully.',
        });
      } catch (err) {
        console.error('Failed to delete user.', err);
        res.status(500).json({
          success: false,
          message: 'Failed to delete user.',
        });
      }
    });

    return router;
  },
};

export default UsersRouter;
