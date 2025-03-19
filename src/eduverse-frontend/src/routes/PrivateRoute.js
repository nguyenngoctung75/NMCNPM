// // Định nghĩa các route yêu cầu người dùng phải đăng nhập để truy cập. 
// // Nếu người dùng chưa đăng nhập, họ sẽ được chuyển hướng đến trang đăng nhập.

// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   const isAuthenticated = true; // Thay thế logic xác thực thực tế ở đây
//   return (
//     <Route
//       {...rest}
//       render={props =>
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/login" />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;