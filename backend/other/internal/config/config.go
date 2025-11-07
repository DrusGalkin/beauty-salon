package config

import (
	"fmt"
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
	"os"
	"time"
)

type Config struct {
	Env     string       `yaml:"env"`
	Server  ServerConfig `yaml:"server"`
	GRPCCfg GRPCConfig   `yaml:"grpc"`
}

type ServerConfig struct {
	Port    string        `yaml:"port"`
	Timeout time.Duration `yaml:"timeout"`
}

type GRPCConfig struct {
	Port         string        `yaml:"port"`
	TimeOut      time.Duration `yaml:"timeout"`
	TimeOutStart time.Duration `yaml:"timeout-start"`
	Network      string        `yaml:"network"`
}

func MustLoadConfig() *Config {
	const op = "configs.MustLoadConfig"

	path := fetchConfigPath()
	var cfg Config

	err := cleanenv.ReadConfig(path, &cfg)
	if err != nil {
		panic(fmt.Errorf("%s: %v", op, err))
	}

	return &cfg
}

func fetchConfigPath() string {
	const op = "configs.fetchConfigPath"

	err := godotenv.Load(".env")
	if err != nil {
		panic(fmt.Errorf("%s: %v", op, err))
	}

	return os.Getenv("CONFIG_PATH")
}
