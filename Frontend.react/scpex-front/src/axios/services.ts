// src/axios/services.ts

// 导入所有自动生成的 API 客户端
import createConf from '../tools/ApiHelper';
import { AuthControllerApi } from './apis/auth-controller-api';
import { DefaultApi } from './apis/default-api';
import { DeprecatedUserGeneralControllerApi } from './apis/deprecated-user-general-controller-api';
import { EmployeeManagementControllerApi } from './apis/employee-management-controller-api';
import { ProductsRelatedControllerApi } from './apis/products-related-controller-api';
import { TradeControllerApi } from './apis/trade-controller-api';
import { TraderManagementControllerApi } from './apis/trader-management-controller-api';
import { WarehouseManagementControllerApi } from './apis/warehouse-management-controller-api';

// 导入 Configuration 类，用于配置 API 客户端
import { Configuration } from './configuration';

// 定义一个接口来统一管理所有 API 实例的类型
export interface ApiServices {
  auth: AuthControllerApi;
  default: DefaultApi;
  deprecatedUserGeneral: DeprecatedUserGeneralControllerApi;
  employeeManagement: EmployeeManagementControllerApi;
  productsRelated: ProductsRelatedControllerApi;
  trade: TradeControllerApi;
  traderManagement: TraderManagementControllerApi;
  warehouseManagement: WarehouseManagementControllerApi;
}

// 创建一个函数来初始化并返回所有 API 实例
// 允许传入自定义的配置，例如 baseUrl, accessToken等
export const createApiServices = (config?: Configuration): ApiServices => {
  const apiConfig = config || new Configuration(); // 如果没有传入配置，则使用默认配置

  return {
    auth: new AuthControllerApi(apiConfig),
    default: new DefaultApi(apiConfig),
    deprecatedUserGeneral: new DeprecatedUserGeneralControllerApi(apiConfig),
    employeeManagement: new EmployeeManagementControllerApi(apiConfig),
    productsRelated: new ProductsRelatedControllerApi(apiConfig),
    trade: new TradeControllerApi(apiConfig),
    traderManagement: new TraderManagementControllerApi(apiConfig),
    warehouseManagement: new WarehouseManagementControllerApi(apiConfig),
  };
};

// 导出一个默认的 API 实例集合，方便快速使用
// 注意：如果您的应用需要动态配置（例如根据用户登录状态设置Token），
// 建议在应用初始化时调用 createApiServices 而不是直接使用此默认导出。
export const api = createApiServices(createConf());