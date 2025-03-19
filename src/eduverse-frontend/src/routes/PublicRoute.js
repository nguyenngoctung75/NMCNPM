// // Định nghĩa các route không yêu cầu người dùng phải đăng nhập để truy cập. 
// // Nếu người dùng đã đăng nhập, họ sẽ được chuyển hướng đến bảng điều khiển (dashboard).

// import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

// const PublicRoute = ({ component: Component, ...rest }) => {
//   const isAuthenticated = true; // Thay thế logic xác thực thực tế ở đây
//   return (
//     <Route
//       {...rest}
//       render={props =>
//         !isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/dashboard" />
//         )
//       }
//     />
//   );
// };

// export default PublicRoute;