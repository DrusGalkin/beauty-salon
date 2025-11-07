package config

import (
	"fmt"
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
	"os"
	"time"
)

type Config struct {
	Env       string       `yaml:"env"`
	ServerCfg ServerConfig `yaml:"http"`
	GRPCCfg   GRPCConfig   `yaml:"grpc"`
	RedisCfg  RedisConfig  `yaml:"redis"`
}

type ServerConfig struct {
	Port    string        `yaml:"port"`
	TimeOut time.Duration `yaml:"timeout"`
}

type GRPCConfig struct {
	Port         string        `yaml:"port"`
	TimeOut      time.Duration `yaml:"timeout"`
	TimeOutStart time.Duration `yaml:"timeout-start"`
	Network      string        `yaml:"network"`
}

type RedisConfig struct {
	TTL time.Duration `yaml:"ttl"`
}

func MustLoadConfig() Config {
	const op = "configs.MustLoadConfig"

	var cfg Config
	err := cleanenv.ReadConfig(
		fetchConfigPath(),
		&cfg,
	)

	if err != nil {
		panic(op + ":" + err.Error())
	}

	return cfg
}

func fetchConfigPath() string {
	const op = "configs.fetchConfigPath"
	if err := godotenv.Load(".env"); err != nil {
		panic(
			fmt.Sprintf(
				"%s: %s",
				op,
				"Ошибка поика env файла",
			),
		)
	}

	return os.Getenv("CONFIG_PATH")
}
