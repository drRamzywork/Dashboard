// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports
import FormLayoutsCollapsible from 'src/views/forms/form-layouts/FormLayoutsCollapsible'

const FormLayouts = () => {
  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
          <FormLayoutsCollapsible />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default FormLayouts
