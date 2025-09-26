<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers first
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Path to the users database file
$usersFile = '../data/users.json';

// Ensure the data directory exists
if (!file_exists('../data')) {
    mkdir('../data', 0777, true);
}

// Function to read users from file
function readUsers($file) {
    if (!file_exists($file)) {
        file_put_contents($file, '[]');
        return [];
    }
    
    $content = file_get_contents($file);
    $users = json_decode($content, true);
    return $users ?: [];
}

// Function to write users to file
function writeUsers($file, $users) {
    $content = json_encode($users, JSON_PRETTY_PRINT);
    return file_put_contents($file, $content);
}

// Function to find user by username or email
function findUser($users, $identifier) {
    foreach ($users as $user) {
        if ($user['username'] === $identifier || $user['email'] === $identifier) {
            return $user;
        }
    }
    return null;
}

// Function to check if username or email exists
function userExists($users, $username, $email) {
    foreach ($users as $user) {
        if ($user['username'] === $username || $user['email'] === $email) {
            return true;
        }
    }
    return false;
}

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'POST':
            // Handle user registration and login
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Check if JSON decoding was successful
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
                exit;
            }
            
            if (!$input || !is_array($input)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'No data received']);
                exit;
            }
            
            $action = $input['action'] ?? '';
            
            if ($action === 'register') {
            $users = readUsers($usersFile);
            
            // Validate required fields
            $required = ['firstName', 'lastName', 'email', 'username', 'studentId', 'department', 'password'];
            foreach ($required as $field) {
                if (empty($input[$field])) {
                    echo json_encode(['success' => false, 'message' => ucfirst($field) . ' is required']);
                    exit;
                }
            }
            
            // Check if user already exists
            if (userExists($users, $input['username'], $input['email'])) {
                echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
                exit;
            }
            
            // Create new user
            $newUser = [
                'id' => count($users) + 1,
                'firstName' => htmlspecialchars($input['firstName']),
                'lastName' => htmlspecialchars($input['lastName']),
                'email' => filter_var($input['email'], FILTER_SANITIZE_EMAIL),
                'username' => htmlspecialchars($input['username']),
                'studentId' => htmlspecialchars($input['studentId']),
                'department' => htmlspecialchars($input['department']),
                'password' => password_hash($input['password'], PASSWORD_DEFAULT),
                'role' => 'student',
                'dateRegistered' => date('Y-m-d H:i:s'),
                'lastLogin' => null
            ];
            
            $users[] = $newUser;
            
            if (writeUsers($usersFile, $users)) {
                // Remove password from response
                unset($newUser['password']);
                echo json_encode([
                    'success' => true, 
                    'message' => 'Registration successful',
                    'user' => $newUser
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to save user data']);
            }
            
        } elseif ($action === 'login') {
            $users = readUsers($usersFile);
            
            $username = $input['username'] ?? '';
            $password = $input['password'] ?? '';
            
            if (empty($username) || empty($password)) {
                echo json_encode(['success' => false, 'message' => 'Username and password are required']);
                exit;
            }
            
            $user = findUser($users, $username);
            
            if ($user && password_verify($password, $user['password'])) {
                // Update last login
                for ($i = 0; $i < count($users); $i++) {
                    if ($users[$i]['username'] === $user['username']) {
                        $users[$i]['lastLogin'] = date('Y-m-d H:i:s');
                        $user['lastLogin'] = $users[$i]['lastLogin'];
                        break;
                    }
                }
                writeUsers($usersFile, $users);
                
                // Remove password from response
                unset($user['password']);
                echo json_encode([
                    'success' => true,
                    'message' => 'Login successful',
                    'user' => $user
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
            }
        }
        break;
        
    case 'GET':
        // Get user info or list users (for admin)
        $users = readUsers($usersFile);
        
        // Remove passwords from all users
        foreach ($users as &$user) {
            unset($user['password']);
        }
        
        echo json_encode(['success' => true, 'users' => $users]);
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>