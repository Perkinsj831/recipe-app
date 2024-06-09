// import React, { useState } from 'react';
// import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

// const SearchBar = ({ onSearch }) => {
//   const [searchParams, setSearchParams] = useState({
//     name: '',
//     creator: '',
//     maxTime: '',
//     maxSteps: '',
//     protein: '',
//   });

//   const handleChange = (e) => {
//     setSearchParams({
//       ...searchParams,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSearch = () => {
//     onSearch(searchParams);
//   };

//   return (
//     <Box my={2}>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             fullWidth
//             label="Recipe Name"
//             name="name"
//             value={searchParams.name}
//             onChange={handleChange}
//             variant="outlined"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <TextField
//             fullWidth
//             label="Creator"
//             name="creator"
//             value={searchParams.creator}
//             onChange={handleChange}
//             variant="outlined"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             fullWidth
//             label="Max Prep Time (min)"
//             name="maxTime"
//             type="number"
//             value={searchParams.maxTime}
//             onChange={handleChange}
//             variant="outlined"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <TextField
//             fullWidth
//             label="Max Steps"
//             name="maxSteps"
//             type="number"
//             value={searchParams.maxSteps}
//             onChange={handleChange}
//             variant="outlined"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <FormControl fullWidth variant="outlined">
//             <InputLabel>Protein Type</InputLabel>
//             <Select
//               label="Protein Type"
//               name="protein"
//               value={searchParams.protein}
//               onChange={handleChange}
//             >
//               <MenuItem value=""><em>None</em></MenuItem>
//               <MenuItem value="Chicken">Chicken</MenuItem>
//               <MenuItem value="Beef">Beef</MenuItem>
//               <MenuItem value="Pork">Pork</MenuItem>
//               <MenuItem value="Vegetarian">Vegetarian</MenuItem>
//               <MenuItem value="Vegan">Vegan</MenuItem>
//               <MenuItem value="Seafood">Seafood</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Button
//             fullWidth
//             variant="contained"
//             color="primary"
//             onClick={handleSearch}
//             style={{ height: '100%' }}
//           >
//             Search
//           </Button>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default SearchBar;
