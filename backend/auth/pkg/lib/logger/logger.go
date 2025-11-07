package logger

import (
	"fmt"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func Load(env string) *zap.Logger {
	var cfg zap.Config
	const op = "logger.Load"

	if env == "local" {
		cfg = zap.NewDevelopmentConfig()
		cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	} else {
		cfg = zap.NewProductionConfig()
	}

	cfg.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder

	cfg.OutputPaths = []string{"stdout", "info.log"}
	cfg.ErrorOutputPaths = []string{"stderr", "errors.log"}

	logger, err := cfg.Build()
	if err != nil {
		panic(fmt.Sprintf("%s: %v", op, err))
	}

	logger.Info("Успешный запуск логгера")
	defer logger.Sync()

	return logger
}
