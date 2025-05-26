import { Configuration } from "../axios";
import { base } from "../env";

export default function createConf(){
    return new Configuration({basePath: base});
}