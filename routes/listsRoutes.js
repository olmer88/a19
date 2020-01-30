const Router = require('koa-router');
const router = new Router({prefix: '/lists'});
const listsController = require('./../controllers/listsController');

router
    .get('/', listsController.showAllLists)
    .post('/add-list', listsController.addList)
    .post('/delete-list', listsController.deleteList);

module.exports = router;