import { Injectable } from '@angular/core';

import { ConfigService, DashboardPart } from '../config/config.service';

import { FrontPartService } from '../../parts/front/front.service';
import { MediaPartService } from '../../parts/media/media.service';
import { UserPartService } from '../../parts/user/user.service';
import { CategoryPartService } from '../../parts/category/category.service';
import { TagPartService } from '../../parts/tag/tag.service';
import { PagePartService } from '../../parts/page/page.service';
import { PostPartService } from '../../parts/post/post.service';
import { OptionPartService } from '../../parts/option/option.service';
import { ProfilePartService } from '../../parts/profile/profile.service';
import { AudioPartService } from '../../parts/audio/audio.service';
import { VideoPartService } from '../../parts/video/video.service';
import { BundlePartService } from '../../parts/bundle/bundle.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private customParts: Record<string, DashboardPart> = {};

  constructor(
    private configService: ConfigService,
    // parts
    public readonly frontPart: FrontPartService,
    public readonly mediaPart: MediaPartService,
    public readonly userPart: UserPartService,
    public readonly categoryPart: CategoryPartService,
    public readonly tagPart: TagPartService,
    public readonly pagePart: PagePartService,
    public readonly postPart: PostPartService,
    public readonly optionPart: OptionPartService,
    public readonly profilePart: ProfilePartService,
    public readonly audioPart: AudioPartService,
    public readonly videoPart: VideoPartService,
    public readonly bundlePart: BundlePartService,
  ) {
    // run plugins
    (this.configService.getConfig().plugins || [])
      .forEach(plugin => plugin(this));
  }

  registerAvailableParts(customParts: Record<string, DashboardPart>) {
    this.customParts = customParts;
    return this as DashboardService;
  }

  init() {
    return this as DashboardService;
  }

  getPart(part: string): undefined | DashboardPart {
    const allParts: Record<string, DashboardPart> = {
      front: this.frontPart,
      media: this.mediaPart,
      user: this.userPart,
      category: this.categoryPart,
      tag: this.tagPart,
      page: this.pagePart,
      post: this.postPart,
      option: this.optionPart,
      profile: this.profilePart,
      audio: this.audioPart,
      video: this.videoPart,
      bundle: this.bundlePart,
      ...this.customParts,
    };
    return allParts[part];
  }

  getParts() {
    return this.configService
      .getConfig()
      .parts
      .map(item => typeof item === 'string' ? this.getPart(item) : item)
      .filter(item => !!item) as DashboardPart[];
  }

  getMenu() {
    return this.getParts().map(item => item.menuItem);
  }
}
