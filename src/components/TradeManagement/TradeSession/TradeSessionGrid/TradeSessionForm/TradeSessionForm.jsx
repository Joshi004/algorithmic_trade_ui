import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Typography
} from "@mui/material";
import React, { Component } from "react";

import InfoIcon from "@mui/icons-material/Info";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { styled } from "@mui/material/styles";

// Styled components for modern UI
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.spacing(2),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  minWidth: '100%',
}));

const DescriptionBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(3),
  fontSize: '1.1rem',
  fontWeight: 600,
}));

class TradeSessionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Form data
      scanningAlgorithmId: "",
      initiationAlgorithmId: "",
      terminationAlgorithmId: "",
      tradingFrequency: "",
      isDummy: true,
      
      // Options from API
      scanningOptions: [],
      initiationOptions: [],
      terminationOptions: [],
      frequencyOptions: [],
      
      // UI state
      loading: true,
      submitting: false,
      error: null,
      
      // Selected descriptions
      scanningDescription: "",
      initiationDescription: "",
      terminationDescription: "",
    };
  }

  async componentDidMount() {
    this.processSessionParameters();
  }

  componentDidUpdate(prevProps) {
    // Update options when sessionParameters prop changes
    if (prevProps.sessionParameters !== this.props.sessionParameters) {
      this.processSessionParameters();
    }
  }

  processSessionParameters = () => {
    const { sessionParameters, parametersLoading } = this.props;
    
    if (parametersLoading) {
      this.setState({ loading: true });
      return;
    }

    if (!sessionParameters) {
      this.setState({ 
        error: "Failed to load session parameters. Please try again.",
        loading: false 
      });
      return;
    }

    try {
      const scanningOptions = sessionParameters.scanning_algorithms.map(algo => ({
        id: algo.id,
        name: algo.name,
        displayName: algo.display_name,
        description: algo.description
      }));
      
      const initiationOptions = sessionParameters.initiation_algorithms.map(algo => ({
        id: algo.id,
        name: algo.name,
        displayName: algo.display_name,
        description: algo.description
      }));
      
      const terminationOptions = sessionParameters.termination_algorithms.map(algo => ({
        id: algo.id,
        name: algo.name,
        displayName: algo.display_name,
        description: algo.description
      }));
      
      const frequencyOptions = sessionParameters.trading_frequencies.map(freq => ({
        value: freq,
        label: this.formatFrequencyLabel(freq)
      }));
      
      this.setState({ 
        scanningOptions, 
        initiationOptions, 
        terminationOptions, 
        frequencyOptions,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error("Error processing session parameters:", error);
      this.setState({ 
        error: "Failed to process session parameters. Please try again.",
        loading: false 
      });
    }
  };

  formatFrequencyLabel = (freq) => {
    // Convert frequency values to user-friendly display text
    const formatMap = {
      '1-minute': '1 Minute',
      '3-minute': '3 Minute', 
      '5-minute': '5 Minute',
      '10-minute': '10 Minute',
      '15-minute': '15 Minute',
      '30-minute': '30 Minute',
      '60-minute': '60 Minute',
      '1-day': '1 Day'
    };
    
    return formatMap[freq] || freq.charAt(0).toUpperCase() + freq.slice(1);
  };

  handleChange = (field) => (event) => {
    const value = event.target.value;
    this.setState({ [field]: value });
  
    // Update description when an algorithm is selected
    if (field === 'scanningAlgorithmId') {
      const selectedAlgo = this.state.scanningOptions.find(algo => algo.id === value);
      this.setState({ scanningDescription: selectedAlgo?.description || "" });
    } else if (field === 'initiationAlgorithmId') {
      const selectedAlgo = this.state.initiationOptions.find(algo => algo.id === value);
      this.setState({ initiationDescription: selectedAlgo?.description || "" });
    } else if (field === 'terminationAlgorithmId') {
      const selectedAlgo = this.state.terminationOptions.find(algo => algo.id === value);
      this.setState({ terminationDescription: selectedAlgo?.description || "" });
    }
  };
  
  handleSwitchChange = (field) => (event) => {
    this.setState({ [field]: event.target.checked });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    
    const { 
      scanningAlgorithmId, 
      initiationAlgorithmId, 
      terminationAlgorithmId, 
      tradingFrequency, 
      isDummy 
    } = this.state;

    // Validation
    if (!scanningAlgorithmId || !initiationAlgorithmId || !terminationAlgorithmId || !tradingFrequency) {
      this.setState({ error: "Please fill in all required fields." });
      return;
    }

    this.setState({ submitting: true, error: null });

    try {
      // Prepare form data for submission
      const formData = {
        scanningAlgorithmId,
        initiationAlgorithmId,
        terminationAlgorithmId,
        tradingFrequency,
        isDummy
      };

      // Call parent's onSubmit method
      await this.props.onSubmit(formData);
      
      // Reset form on successful submission
      this.setState({
        scanningAlgorithmId: "",
        initiationAlgorithmId: "",
        terminationAlgorithmId: "",
        tradingFrequency: "",
        scanningDescription: "",
        initiationDescription: "",
        terminationDescription: "",
      });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      this.setState({ error: "Failed to initiate trade session. Please try again." });
    } finally {
      this.setState({ submitting: false });
    }
  };

  renderFormField = (
    label, 
    field, 
    options, 
    description, 
    required = true, 
    helperText = ""
  ) => {
    return (
      <Box mb={2}>
        <StyledFormControl required={required}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={this.state[field]}
            onChange={this.handleChange(field)}
            label={label}
          >
            {options.map((option) => (
              <MenuItem key={option.id || option.value} value={option.id || option.value}>
                {option.displayName || option.label}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
        
        {description && (
          <DescriptionBox elevation={0}>
            <Box display="flex" alignItems="flex-start" gap={1}>
              <InfoIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </DescriptionBox>
        )}
        
        {helperText && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {helperText}
          </Typography>
        )}
      </Box>
    );
  };

  render() {
    const { 
      scanningOptions, 
      initiationOptions, 
      terminationOptions, 
      frequencyOptions,
      scanningDescription,
      initiationDescription,
      terminationDescription,
      isDummy,
      loading,
      submitting,
      error
    } = this.state;

    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      );
    }

    return (
      <StyledCard>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <PlayArrowIcon color="primary" />
              <Typography variant="h5" component="h2" fontWeight="600">
                Initiate New Trade Session
              </Typography>
            </Box>
          }
          subheader="Configure your algorithmic trading session parameters"
        />
        
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={this.handleSubmit}>
            {this.renderFormField(
              "Scanning Algorithm",
              "scanningAlgorithmId",
              scanningOptions,
              scanningDescription,
              true,
              "Algorithm used to scan and identify trading opportunities"
            )}
            
            <Divider sx={{ my: 2 }} />
            
            {this.renderFormField(
              "Initiation Algorithm",
              "initiationAlgorithmId",
              initiationOptions,
              initiationDescription,
              true,
              "Algorithm used to initiate trades based on scanning results"
            )}
            
            <Divider sx={{ my: 2 }} />
            
            {this.renderFormField(
              "Termination Algorithm",
              "terminationAlgorithmId",
              terminationOptions,
              terminationDescription,
              true,
              "Algorithm used to terminate trades and manage exits"
            )}
            
            <Divider sx={{ my: 2 }} />
            
            {this.renderFormField(
              "Trading Frequency",
              "tradingFrequency",
              frequencyOptions,
              null,
              true,
              "Time interval for trading decisions and analysis"
            )}
            
            <Box my={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDummy}
                    onChange={this.handleSwitchChange('isDummy')}
                    color="primary"
                  />
                }
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">
                      Paper Trading Mode
                    </Typography>
                    <Chip 
                      size="small" 
                      label={isDummy ? "Demo" : "Live"} 
                      color={isDummy ? "default" : "warning"}
                      variant="outlined"
                    />
                  </Box>
                }
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                {isDummy 
                  ? "Simulate trades without real money for testing and learning"
                  : "Execute real trades with actual capital - use with caution"
                }
              </Typography>
            </Box>
            
            <SubmitButton
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            >
              {submitting ? "Initiating Session..." : "Start Trading Session"}
            </SubmitButton>
          </Box>
        </CardContent>
      </StyledCard>
    );
  }
}

export default TradeSessionForm;
