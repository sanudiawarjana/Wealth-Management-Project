const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = process.env.LOG_DIR || path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    const formattedMessage = typeof message === 'object' 
      ? JSON.stringify(message, null, 2) 
      : message;
    
    return `[${timestamp}] [${level.toUpperCase()}] ${formattedMessage}`;
  }

  writeToFile(level, message) {
    const logFile = path.join(this.logDir, `${level}.log`);
    const formattedMessage = this.formatMessage(level, message);
    
    fs.appendFile(logFile, formattedMessage + '\n', (err) => {
      if (err) console.error('Error writing to log file:', err);
    });
  }

  info(message) {
    const formatted = this.formatMessage('info', message);
    console.log('\x1b[36m%s\x1b[0m', formatted); // Cyan
    this.writeToFile('info', message);
  }

  error(message) {
    const formatted = this.formatMessage('error', message);
    console.error('\x1b[31m%s\x1b[0m', formatted); // Red
    this.writeToFile('error', message);
  }

  warn(message) {
    const formatted = this.formatMessage('warn', message);
    console.warn('\x1b[33m%s\x1b[0m', formatted); // Yellow
    this.writeToFile('warn', message);
  }

  debug(message) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = this.formatMessage('debug', message);
      console.log('\x1b[35m%s\x1b[0m', formatted); // Magenta
      this.writeToFile('debug', message);
    }
  }

  success(message) {
    const formatted = this.formatMessage('success', message);
    console.log('\x1b[32m%s\x1b[0m', formatted); // Green
    this.writeToFile('info', message);
  }
}

module.exports = new Logger();
