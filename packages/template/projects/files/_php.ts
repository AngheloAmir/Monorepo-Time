export const phpContent = `<?php
$file = 'visits.txt';
if (!file_exists($file)) {
    file_put_contents($file, 0);
}
$count = (int)file_get_contents($file);
$count++;
file_put_contents($file, $count);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Monorepo Time</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap');
        body { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="bg-gray-900 text-white min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>

    <div class="z-10 text-center p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl max-w-lg w-full transform hover:scale-105 transition-transform duration-300">
        <div class="mb-6">
            <span class="text-4xl">🚀</span>
        </div>
        <h1 class="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Monorepo Time
        </h1>
        <p class="text-gray-300 text-lg mb-6">
            Your PHP application is up and running.
        </p>
        
        <div class="bg-black/30 rounded-xl p-4 mb-6">
            <p class="text-sm text-gray-400 uppercase tracking-widest mb-1">Total Visits</p>
            <p class="text-3xl font-mono font-bold text-green-400">
                <?php echo number_format($count); ?>
            </p>
        </div>

        <div class="flex justify-center gap-4">
            <a href="#" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors duration-200">
                Documentation
            </a>
            <a href="#" class="px-6 py-2 bg-transparent border border-white/30 hover:bg-white/10 rounded-full font-medium transition-colors duration-200">
                Learn More
            </a>
        </div>
    </div>

    <!-- Animation Keyframes -->
    <style>
        @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
    </style>
</body>
</html>
`;
