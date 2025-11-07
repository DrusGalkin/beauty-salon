package config

import (
	"fmt"
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
	"os"
	"time"
)

type Config struct {
	Env        string     `yaml:"env"`
	GRPCConfig GRPCConfig `yaml:"grpc"`
	JWTConfig  JWTConfig  `yaml:"jwt"`
}

type GRPCConfig struct {
	Port    string        `yaml:"port"`
	Timeout time.Duration `yaml:"timeout"`
}

type JWTConfig struct {
	AccessTTL  time.Duration
	RefreshTTL time.Duration
}

func MustLoadConfig() Config {
	var cfg Config
	const op = "configs.MustLoadConfig"

	if err := cleanenv.ReadConfig(
		fetchConfigPath(),
		&cfg); err != nil {
		panic(fmt.Errorf("%s: %v", op, err))
	}

	return cfg
}

func fetchConfigPath() string {
	const op = "configs.fetchConfigPath"

	if err := godotenv.Load(".env"); err != nil {
		panic(fmt.Errorf("%s: %v", op, err))
	}

	return os.Getenv("CONFIG_PATH")
}
