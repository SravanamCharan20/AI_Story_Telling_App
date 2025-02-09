import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Easing, TextInput, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Animation values
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;
  const inputsSlideUp = useRef([0, 1, 2, 3].map(() => new Animated.Value(20))).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const inputScales = useRef([0, 1, 2, 3].map(() => new Animated.Value(1))).current;

  // Initial animations
  useEffect(() => {
    const animations = [
      // Fade and slide main content
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Stagger input animations
      ...inputsSlideUp.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          delay: 100 * index,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ),
    ];

    Animated.parallel(animations).start();
  }, []);

  // Input focus animation
  const handleFocus = (index) => {
    Animated.spring(inputScales[index], {
      toValue: 1.02,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  // Input blur animation
  const handleBlur = (index) => {
    Animated.spring(inputScales[index], {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  // Button animations
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const renderInput = (input, index) => {
    const isPassword = input.placeholder.toLowerCase().includes('password');
    const showPasswordState = input.placeholder === 'Password' ? showPassword : showConfirmPassword;
    const togglePasswordVisibility = () => {
      if (input.placeholder === 'Password') {
        setShowPassword(!showPassword);
      } else {
        setShowConfirmPassword(!showConfirmPassword);
      }
    };

    return (
      <Animated.View
        key={index}
        style={[{
          transform: [
            { translateY: inputsSlideUp[index] },
            { scale: inputScales[index] }
          ],
          width: '100%',
        }]}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>{input.icon}</Text>
          <TextInput
            style={styles.input}
            placeholder={input.placeholder}
            placeholderTextColor="#999"
            value={input.value}
            onChangeText={input.onChange}
            secureTextEntry={isPassword && !showPasswordState}
            keyboardType={input.keyboardType}
            autoCapitalize="none"
            onFocus={() => handleFocus(index)}
            onBlur={() => handleBlur(index)}
            maxLength={isPassword ? 32 : 50}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.passwordToggle}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showPasswordState ? "eye-off" : "eye"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#2C3E50', '#3498DB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeIn,
                transform: [{ translateY: slideUp }],
              },
            ]}
          >
            <View style={styles.card}>
              <View style={styles.headerContainer}>
                <Text style={styles.welcomeText}>Create Account</Text>
                <Text style={styles.subtitleText}>
                  Join our magical storytelling community
                </Text>
              </View>

              {[
                {
                  placeholder: 'Username',
                  value: formData.username,
                  onChange: (text) => setFormData({ ...formData, username: text }),
                  icon: '👤',
                },
                {
                  placeholder: 'Email Address',
                  value: formData.email,
                  onChange: (text) => setFormData({ ...formData, email: text }),
                  icon: '✉️',
                  keyboardType: 'email-address',
                },
                {
                  placeholder: 'Password',
                  value: formData.password,
                  onChange: (text) => setFormData({ ...formData, password: text }),
                  icon: '🔒',
                  secureTextEntry: true,
                },
                {
                  placeholder: 'Confirm Password',
                  value: formData.confirmPassword,
                  onChange: (text) => setFormData({ ...formData, confirmPassword: text }),
                  icon: '🔒',
                  secureTextEntry: true,
                },
              ].map((input, index) => renderInput(input, index))}

              <TouchableOpacity
                onPress={() => {}}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.buttonContainer}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={{
                    transform: [{ scale: buttonScale }],
                    width: '100%',
                  }}
                >
                  <LinearGradient
                    colors={['#0A84FF', '#0066CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Sign Up</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/auth/signIn")}
                style={styles.signInLink}
                activeOpacity={0.7}
              >
                <Text style={styles.signInText}>
                  Already have an account? <Text style={styles.signInTextBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 35,
    padding: 32,
    width: width * 0.9,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#636366',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    marginBottom: 16,
    padding: 4,
    width: '100%',
    minHeight: 60,
  },
  inputIcon: {
    fontSize: 20,
    padding: 12,
    width: 48,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: '#1C1C1E',
    minHeight: 52,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signInLink: {
    marginTop: 20,
    padding: 10,
  },
  signInText: {
    color: '#636366',
    fontSize: 15,
  },
  signInTextBold: {
    color: '#0A84FF',
    fontWeight: '600',
  },
  passwordToggle: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});