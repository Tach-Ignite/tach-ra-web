import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Session } from 'next-auth';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import { ReactElement } from 'react';
import 'swagger-ui-react/swagger-ui.css';
import swaggerConfig from '~/swagger.config';

const SwaggerUI = dynamic<{
  spec: Record<string, any>;
  // @ts-ignore
}>(import('swagger-ui-react'), { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec(swaggerConfig);

  return {
    props: {
      spec,
    },
  };
};

ApiDoc.getLayout = function getLayout(page: ReactElement, session: Session) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{page}</>;
};

export default ApiDoc;
