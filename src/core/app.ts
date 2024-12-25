import express from 'express';
import userRoutes from '../routes/userRoutes';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1', userRoutes);

const printApiList = () => {
  try {
    const apiRoutes: { method: string; path: string }[] = [];

    app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        const path = middleware.route.path;
        middleware.route.stack.forEach((layer: any) => {
          if (layer.method) {
            apiRoutes.push({
              method: layer.method.toUpperCase(),
              path: `/api/v1${path}`,
            });
          }
        });
      }
    });

    if (apiRoutes.length === 0) {
      console.log('Tidak ada API yang terdaftar.');
      return;
    }

    console.log('Daftar API yang terdaftar:');
    apiRoutes.forEach(route => {
      console.log(`${route.method} ${route.path}`);
    });

    console.log('Proses pencetakan daftar API berhasil.');
  } catch (error) {
    console.error('Terjadi kesalahan saat mencetak daftar API:', error);
  }
};

printApiList();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
