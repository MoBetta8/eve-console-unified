"""
Tests for digimaster_brain.py

Run with: python -m unittest test_digimaster_brain.py
"""

import unittest
from unittest.mock import Mock, patch, call
import os


class TestDigimasterBrainFunctions(unittest.TestCase):
    """Test the digimaster_brain module functions"""
    
    def setUp(self):
        """Set up test environment"""
        # Save original env
        self.original_api_key = os.environ.get('OPENROUTER_API_KEY')
        # Set test API key
        os.environ['OPENROUTER_API_KEY'] = 'test-api-key-12345'
        
        # Import module with mocked subprocess
        with patch('subprocess.run'):
            # Force reload if already imported
            import sys
            if 'digimaster_brain' in sys.modules:
                del sys.modules['digimaster_brain']
            
            import digimaster_brain
            self.module = digimaster_brain
    
    def tearDown(self):
        """Clean up after tests"""
        # Restore original environment
        if self.original_api_key:
            os.environ['OPENROUTER_API_KEY'] = self.original_api_key
        else:
            if 'OPENROUTER_API_KEY' in os.environ:
                del os.environ['OPENROUTER_API_KEY']

    @patch('digimaster_brain.requests.post')
    def test_ask_gpt_success(self, mock_post):
        """Test successful GPT API call"""
        # Mock response
        mock_response = Mock()
        mock_response.json.return_value = {
            'choices': [
                {
                    'message': {
                        'content': 'This is a test response from GPT'
                    }
                }
            ]
        }
        mock_post.return_value = mock_response
        
        # Call function
        result = self.module.ask_gpt('What is AI?')
        
        # Assertions
        self.assertEqual(result, 'This is a test response from GPT')
        self.assertTrue(mock_post.called)
        
        # Verify the API endpoint
        call_args = mock_post.call_args
        self.assertEqual(call_args[0][0], 'https://openrouter.ai/api/v1/chat/completions')

    @patch('digimaster_brain.requests.post')
    def test_ask_gpt_with_correct_headers(self, mock_post):
        """Test that API call includes correct headers"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'choices': [{'message': {'content': 'Response'}}]
        }
        mock_post.return_value = mock_response
        
        self.module.ask_gpt('Test')
        
        # Check headers
        call_kwargs = mock_post.call_args[1]
        self.assertIn('headers', call_kwargs)
        headers = call_kwargs['headers']
        self.assertIn('Authorization', headers)
        self.assertIn('Bearer', headers['Authorization'])
        self.assertEqual(headers['Content-Type'], 'application/json')

    @patch('digimaster_brain.requests.post')
    def test_ask_gpt_uses_correct_model(self, mock_post):
        """Test that the correct model is specified"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'choices': [{'message': {'content': 'Response'}}]
        }
        mock_post.return_value = mock_response
        
        self.module.ask_gpt('Test prompt')
        
        # Check the request data
        call_kwargs = mock_post.call_args[1]
        request_data = call_kwargs['json']
        self.assertEqual(request_data['model'], 'deepseek/deepseek-chat-v3.1:free')

    @patch('digimaster_brain.requests.post')
    def test_ask_gpt_sends_message(self, mock_post):
        """Test that the user prompt is sent correctly"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'choices': [{'message': {'content': 'Response'}}]
        }
        mock_post.return_value = mock_response
        
        test_prompt = 'Explain quantum computing'
        self.module.ask_gpt(test_prompt)
        
        # Check the message
        call_kwargs = mock_post.call_args[1]
        request_data = call_kwargs['json']
        messages = request_data['messages']
        
        self.assertEqual(len(messages), 1)
        self.assertEqual(messages[0]['role'], 'user')
        self.assertEqual(messages[0]['content'], test_prompt)

    @patch('digimaster_brain.requests.post')
    def test_ask_gpt_error_handling(self, mock_post):
        """Test error handling when API call fails"""
        mock_post.side_effect = Exception('Network timeout')
        
        result = self.module.ask_gpt('Test')
        
        self.assertIn('Error talking to GPT', result)
        self.assertIn('Network timeout', result)

    @patch('digimaster_brain.requests.post')
    def test_ask_gpt_malformed_response(self, mock_post):
        """Test handling of malformed API response"""
        mock_response = Mock()
        mock_response.json.return_value = {'error': 'Invalid request'}
        mock_post.return_value = mock_response
        
        result = self.module.ask_gpt('Test')
        
        # Should handle the error gracefully
        self.assertIn('Error talking to GPT', result)

    @patch('digimaster_brain.subprocess.run')
    def test_speak_calls_subprocess(self, mock_run):
        """Test that speak function calls subprocess correctly"""
        test_text = 'Hello, this is a test'
        
        self.module.speak(test_text)
        
        # Should call subprocess.run twice (piper and start)
        self.assertEqual(mock_run.call_count, 2)

    @patch('digimaster_brain.subprocess.run')
    def test_speak_uses_correct_command(self, mock_run):
        """Test that speak uses the piper command correctly"""
        test_text = 'Test speech'
        
        self.module.speak(test_text)
        
        # Get first call (piper command)
        first_call = mock_run.call_args_list[0]
        call_args = first_call[0][0]
        
        # Check piper is in the command
        self.assertIn('piper', call_args)


class TestEnvironmentConfiguration(unittest.TestCase):
    """Test environment variable configuration"""
    
    def test_requires_api_key(self):
        """Test that the module requires OPENROUTER_API_KEY"""
        # This test verifies the security improvement
        # Remove the API key
        if 'OPENROUTER_API_KEY' in os.environ:
            del os.environ['OPENROUTER_API_KEY']
        
        # Importing should fail without API key
        import sys
        if 'digimaster_brain' in sys.modules:
            del sys.modules['digimaster_brain']
        
        with self.assertRaises(ValueError) as context:
            with patch('subprocess.run'):
                import digimaster_brain
        
        self.assertIn('OPENROUTER_API_KEY', str(context.exception))


if __name__ == '__main__':
    # Run tests
    unittest.main(verbosity=2)

