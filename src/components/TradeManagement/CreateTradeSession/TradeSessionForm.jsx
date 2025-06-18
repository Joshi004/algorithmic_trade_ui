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
      scanningAlgorithmName: "",
      initiationAlgorithmName: "",
      terminationAlgorithmName: "",
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
    if (field === 'scanningAlgorithmName') {
      const selectedAlgo = this.state.scanningOptions.find(algo => algo.name === value);
      this.setState({ scanningDescription: selectedAlgo?.description || "" });
    } else if (field === 'initiationAlgorithmName') {
      const selectedAlgo = this.state.initiationOptions.find(algo => algo.name === value);
      this.setState({ initiationDescription: selectedAlgo?.description || "" });
    } else if (field === 'terminationAlgorithmName') {
      const selectedAlgo = this.state.terminationOptions.find(algo => algo.name === value);
      this.setState({ terminationDescription: selectedAlgo?.description || "" });
    }
  };
  
  handleSwitchChange = (field) => (event) => {
    this.setState({ [field]: event.target.checked });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    
    const { 
      scanningAlgorithmName, 
      initiationAlgorithmName, 
      terminationAlgorithmName, 
      tradingFrequency, 
      isDummy 
    } = this.state;

    // Validation
    if (!scanningAlgorithmName || !initiationAlgorithmName || !terminationAlgorithmName || !tradingFrequency) {
      this.setState({ error: "Please fill in all required fields." });
      return;
    }

    this.setState({ submitting: true, error: null });

    try {
      // Prepare form data for submission
      const formData = {
        scanningAlgorithmName,
        initiationAlgorithmName,
        terminationAlgorithmName,
        tradingFrequency,
        isDummy
      };

      // Call parent's onSubmit method
      await this.props.onSubmit(formData);
      
      // Reset form on successful submission
      this.setState({
        scanningAlgorithmName: "",
        initiationAlgorithmName: "",
        terminationAlgorithmName: "",
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
      <Box key={field}>
        <StyledFormControl required={required}>
          <InputLabel>{label}</InputLabel>
          <Select
            value={this.state[field]}
            onChange={this.handleChange(field)}
            label={label}
          >
            {options.map((option) => (
              <MenuItem key={option.id || option.value} value={option.name || option.value}>
                <Box>
                  <Typography variant="body2" fontWeight="600">
                    {option.displayName || option.label}
                  </Typography>
                  {option.name !== option.displayName && (
                    <Typography variant="caption" color="text.secondary">
                      {option.name}
                    </Typography>
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
          {helperText && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {helperText}
            </Typography>
          )}
        </StyledFormControl>
        
        {description && (
          <DescriptionBox elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <InfoIcon sx={{ fontSize: 20, color: 'primary.main', mt: 0.2 }} />
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </DescriptionBox>
        )}
      </Box>
    );
  };

  render() {
    const { 
      loading, 
      submitting, 
      error,
      scanningOptions,
      initiationOptions,
      terminationOptions,
      frequencyOptions,
      scanningDescription,
      initiationDescription,
      terminationDescription,
      isDummy
    } = this.state;

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box component="form" onSubmit={this.handleSubmit} sx={{ width: '100%' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Demo Mode Toggle */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDummy}
                onChange={this.handleSwitchChange('isDummy')}
                color="warning"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight="600">
                  Demo Mode
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isDummy 
                    ? "Session will run with simulated trades (no real money)"
                    : "Session will execute real trades with actual money"
                  }
                </Typography>
              </Box>
            }
          />
          {!isDummy && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2" fontWeight="600">
                Real Trading Mode Enabled
              </Typography>
              <Typography variant="caption">
                This session will execute real trades with actual money. Make sure you understand the risks.
              </Typography>
            </Alert>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Algorithm Selection */}
        {this.renderFormField(
          "Scanning Algorithm",
          "scanningAlgorithmName",
          scanningOptions,
          scanningDescription,
          true,
          "Algorithm used to scan and identify trading opportunities"
        )}

        <Divider sx={{ my: 2 }} />

        {this.renderFormField(
          "Initiation Algorithm", 
          "initiationAlgorithmName",
          initiationOptions,
          initiationDescription,
          true,
          "Algorithm used to determine when to enter trades"
        )}

        <Divider sx={{ my: 2 }} />

        {this.renderFormField(
          "Termination Algorithm",
          "terminationAlgorithmName", 
          terminationOptions,
          terminationDescription,
          true,
          "Algorithm used to determine when to exit trades"
        )}

        <Divider sx={{ my: 2 }} />

        {/* Trading Frequency */}
        <StyledFormControl required>
          <InputLabel>Trading Frequency</InputLabel>
          <Select
            value={this.state.tradingFrequency}
            onChange={this.handleChange('tradingFrequency')}
            label="Trading Frequency"
          >
            {frequencyOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Chip 
                  label={option.label}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            How frequently the algorithms will evaluate and potentially execute trades
          </Typography>
        </StyledFormControl>

        {/* Submit Button */}
        <SubmitButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : <PlayArrowIcon />}
        >
          {submitting ? "Creating Session..." : "Create Trade Session"}
        </SubmitButton>
      </Box>
    );
  }
}

export default TradeSessionForm; 