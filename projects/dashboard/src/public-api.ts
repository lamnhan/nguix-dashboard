/*
 * Public API Surface of dashboard
 */

export * from './lib/dashboard.module';

export * from './lib/services/config/config.service';

export * from './lib/components/header/header.component';
export {HeaderComponentModule} from './lib/components/header/header.module';

export * from './lib/pages/home/home.component';
export {HomePageModule} from './lib/pages/home/home.module';
