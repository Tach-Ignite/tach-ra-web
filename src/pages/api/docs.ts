import { withSwagger } from 'next-swagger-doc';
import swaggerConfig from '~/swagger.config';

const swaggerHandler = withSwagger(swaggerConfig);
export default swaggerHandler();
