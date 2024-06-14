var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"home","loadChildren":"./pages/home/home.module#HomePageModule","canActivate":["AuthGuard"],"children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/home/home-routing.module.ts","module":"HomePageRoutingModule","children":[{"path":"","component":"HomePage"}],"kind":"module"}],"module":"HomePageModule"}]},{"path":"","redirectTo":"home","pathMatch":"full"},{"path":"squads","loadChildren":"./pages/mysquads/mysquads.module#MySquadsPageModule","canActivate":["AuthGuard","UserGuard"],"children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/mysquads/mysquads-routing.module.ts","module":"MySquadsPageRoutingModule","children":[{"path":"","component":"MySquadsPage"}],"kind":"module"}],"module":"MySquadsPageModule"}]},{"path":"players","loadChildren":"./pages/myplayers/myplayers.module#MyplayersPageModule","canActivate":["AuthGuard"],"children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/myplayers/myplayers-routing.module.ts","module":"MyplayersPageRoutingModule","children":[{"path":"","component":"MyplayersPage"}],"kind":"module"}],"module":"MyplayersPageModule"}]},{"path":"login","loadChildren":"./pages/login/login.module#LoginPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/login/login-routing.module.ts","module":"LoginPageRoutingModule","children":[{"path":"","component":"LoginPage"}],"kind":"module"}],"module":"LoginPageModule"}]},{"path":"register","loadChildren":"./pages/register/register.module#RegisterPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/register/register-routing.module.ts","module":"RegisterPageRoutingModule","children":[{"path":"","component":"RegisterPage"}],"kind":"module"}],"module":"RegisterPageModule"}]},{"path":"about","loadChildren":"./pages/about/about.module#AboutPageModule","canActivate":["AuthGuard"],"children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/about/about-routing.module.ts","module":"AboutPageRoutingModule","children":[{"path":"","component":"AboutPage"}],"kind":"module"}],"module":"AboutPageModule"}]},{"path":"splash","loadChildren":"./pages/splash/splash.module#SplashPageModule","children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/splash/splash-routing.module.ts","module":"SplashPageRoutingModule","children":[{"path":"","component":"SplashPage"}],"kind":"module"}],"module":"SplashPageModule"}]},{"path":"user","loadChildren":"./pages/user/user.module#UserPageModule","canActivate":["AuthGuard"],"children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/user/user-routing.module.ts","module":"UserPageRoutingModule","children":[{"path":"","component":"UserPage"}],"kind":"module"}],"module":"UserPageModule"}]},{"path":"training","loadChildren":"./pages/training/training.module#TrainingPageModule","canActivate":["AuthGuard"],"children":[{"kind":"module","children":[{"name":"routes","filename":"src/app/pages/training/training-routing.module.ts","module":"TrainingPageRoutingModule","children":[{"path":"","component":"TrainingPage"}],"kind":"module"}],"module":"TrainingPageModule"}]}],"kind":"module"}]}
