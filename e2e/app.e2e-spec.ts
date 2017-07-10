import { EnergeticsAppPage } from './app.po';

describe('energetics-app App', () => {
  let page: EnergeticsAppPage;

  beforeEach(() => {
    page = new EnergeticsAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
