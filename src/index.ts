import puppeteer from "puppeteer"

interface ScreenShoter<T> {

    takeScreenShot(url: string, params: T): Promise<any>;
}

interface ParamsTakeScreenShoot {
    width?: number
    height?: number
    element?: string
    filename: string
    quality: number
    isFullPage: boolean;
}

class PuppeteerScreenShoter implements ScreenShoter<ParamsTakeScreenShoot> {
    
    constructor() {}

    async takeScreenShot(url: string, params: ParamsTakeScreenShoot): Promise<any> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        await page.goto(url);
        if (params.width && params.height) {
            await page.setViewport({ width: params.width, height: params.height });
        }

        if (params.element) {
            // @ts-ignore
            const element = await page.$(params.element);
            await element.screenshot({ 
                path: params.filename, quality: params.quality 
            });
            return;
        } else if (params.isFullPage) {
            await page.screenshot({ path: params.filename, quality: params.quality })
        } else {
            await page.screenshot({ 
                path: params.filename, fullPage: true, quality: params.quality
            });
        }
        
        return browser.close();
    }
}

async function start() {
    const puppeteerScreenShoter: ScreenShoter<ParamsTakeScreenShoot> = new PuppeteerScreenShoter() 

    await puppeteerScreenShoter.takeScreenShot(
        'https://coodesh.com',
        { filename: "screenshots/teste.jpeg", width: 1920, height: 1080, isFullPage: false, quality: 100 }
    )

    await puppeteerScreenShoter.takeScreenShot(
        'https://coodesh.com',
        { filename: "screenshots/teste-full.jpeg", isFullPage: true, quality: 100 }
    )

    await puppeteerScreenShoter.takeScreenShot(
        'https://blog.logrocket.com/configuring-nodemon-with-typescript/',
        { filename: "screenshots/header.jpeg", element: ".navbar-light", isFullPage: false, quality: 30 }
    )

    await puppeteerScreenShoter.takeScreenShot(
        'https://www.twitch.tv/gaules',
        { filename: "screenshots/gaules.jpeg", isFullPage: true, quality: 100 }
    )

    console.log("finished process")
}

start()