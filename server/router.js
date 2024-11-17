const DomoModel = require('./models/Domo');
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);
  app.post('/maker', (req, res) => {
    const { name, age, emotion } = req.body;
    DomoModel.create({ name, age, emotion }, (err, newDomo) => {
      if (err) {
        res.status(500).send('Error saving Domo');
        return;
      }
      res.status(201).send({ domo: newDomo });
    });
  });

  app.delete('/deleteDomo/:id', mid.requiresLogin, async (req, res) => {
    const domoId = req.params.id;
    try {
      const result = await DomoModel.findByIdAndDelete(domoId);
      if (!result) {
        return res.status(404).send('Domo not found');
      }
      return res.status(200).send({ message: 'Domo deleted successfully' });
    } catch (err) {
      return res.status(500).send('Error deleting Domo');
    }
  });
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
