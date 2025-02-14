import { Page } from "playwright-core";
export default class PromptElementUtil {
page:Page;
evalString:string;

constructor(page:Page){
    this.page=page;
}
async promptAccept():Promise<void>{
    try{
        await this.page.on('dialog', dialog => dialog.accept());
    }catch(error){
        console.error("Error in promptAccept:",error);
    }
}
}