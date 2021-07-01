/*
 * Public API Surface of dashboard
 */

export * from './lib/dashboard.module';

export * from './lib/services/config/config.service';
export * from './lib/services/dashboard/dashboard.service';

export * from './lib/parts/front/front.service';
export * from './lib/parts/category/category.service';
export * from './lib/parts/tag/tag.service';
export * from './lib/parts/page/page.service';
export * from './lib/parts/post/post.service';

export * from './lib/components/header/header.component';
export * from './lib/components/header/header.module';

export * from './lib/pages/home/home.component';
export * from './lib/pages/home/home.module';
export * from './lib/pages/list/list.component';
export * from './lib/pages/list/list.module';
export * from './lib/pages/edit/edit.component';
export * from './lib/pages/edit/edit.module';
