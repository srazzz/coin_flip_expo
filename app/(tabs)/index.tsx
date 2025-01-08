import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Tails from '../../assets/images/Tails.png';
import Heads from '../../assets/images/Heads.png';

type Side = 'Heads' | 'Tails';

export default function App() {
  const [result, setResult] = useState('Choose a side!');
  const [userChoice, setUserChoice] = useState<Side | null>(null);
  const [gameState, setGameState] = useState('choosing');
  const [score, setScore] = useState(0);
  const [animation] = useState(new Animated.Value(0));
  //starting with heads
  const spinValue = useRef(new Animated.Value(1)).current;
  const [isFlipping, setIsFlipping] = useState(false);

  // Interpolations for flipping animation
  // const rotateY = spinValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['0deg', '0deg'],
  // });

  // if spinValue is 0, front face is visible
  const frontOpacity = spinValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  // if spinValue is 1, back face is visible
  const backOpacity = spinValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const resetGame = () => {
    setGameState('choosing');
    setUserChoice(null);
    setResult('Choose a side!');
    animation.setValue(0);
  };

  const chooseSide = (choice: Side) => {
    setUserChoice(choice);
    flipCoin();
  };

  const flipCoin = () => {
    if (!userChoice) return;
    
    setIsFlipping(true);
    
    const flipDuration = 100;
    const totalDuration = 2000;
    const numberOfFlips = Math.floor(totalDuration / flipDuration);

    // Generate multiple flips
    const flips = Array(numberOfFlips).fill(null).map((_, index) => {
      return Animated.timing(spinValue, {
        toValue: (index + 1) % 2, //to alternate between heads and tails
        duration: flipDuration,
        useNativeDriver: true,
      });
    });

    // Run all animations in sequence
    Animated.sequence(flips).start();

    setTimeout(() => {
      // Generate random result
      const coinResult: Side = Math.random() < 0.5 ? 'Heads' : 'Tails';
      const didWin = userChoice === coinResult;
      
      // Set final spin value based on result
      // spinValue 0 = no rotation (shows Heads image)
      // spinValue 1 = 180deg rotation (shows Tails image)
      // Therefore:
      // - For Tails result, we need rotation (setValue(1))
      // - For Heads result, we need no rotation (setValue(0))
      spinValue.setValue(coinResult === 'Heads' ? 1 : 0);
      
      if (didWin) {
        setScore(prev => prev + 1);
        setResult(`${coinResult}! You Won! 🎉`);
      } else {
        setResult(`${coinResult}! You Lost 😢`);
      }
      setGameState('result');
      setIsFlipping(false);
    }, totalDuration);
  };

  return (
    <LinearGradient
    // Background Linear Gradient
      colors={['#7b86d7', '#bca0de', '#dfbdd8']}
      style={styles.container}
    >
      <Text style={styles.title}>Coin Flip Game</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.result}>{result}</Text>
     
      <Animated.View
        style={styles.coin}
      >
        <Animated.Image
          source={Heads}
          style={[
            styles.face, 
            { opacity: frontOpacity }
          ]}
        />

        <Animated.Image
          source={Tails}
          style={[
            styles.face, 
            { opacity: backOpacity }
          ]}
        />
      </Animated.View>

      {gameState === 'choosing' && (
        <View style={styles.choiceContainer}>
          <TouchableOpacity 
            style={[
              styles.choiceButton,
              isFlipping && styles.disabledButton
            ]} 
            onPress={() => chooseSide('Heads')}
            disabled={isFlipping}
          >
            <Text style={styles.buttonText}>Choose Heads</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.choiceButton,
              isFlipping && styles.disabledButton
            ]} 
            onPress={() => chooseSide('Tails')}
            disabled={isFlipping}
          >
            <Text style={styles.buttonText}>Choose Tails</Text>
          </TouchableOpacity>
        </View>
      )}

      {gameState === 'result' && (
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    marginBottom: 30,
    color: '#333',
  },
  coin: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  choiceContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  choiceButton: {
    backgroundColor: '#f4e0c5',
    padding: 15,
    borderRadius: 10,
    width: 'auto',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#f7d2ae',
    padding: 15,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#cccccc',
  },
});