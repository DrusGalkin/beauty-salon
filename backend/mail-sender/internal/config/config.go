package config

import (
	"fmt"
	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
	"os"
	"time"
)

type Config struct {
	Mail   MailSenderConfig `yaml:"mail"`
	Rdb    RedisConfig      `yaml:"redis"`
	Server ServerConfig     `yaml:"server"`
}

type MailSenderConfig struct {
	Host         string `yaml:"host"`
	Hostname     string `yaml:"host_user"`
	From         string `yaml:"from"`
	Subject      string `yaml:"subject"`
	smtpPassword string
	Port         int `yaml:"port"`
}

type ServerConfig struct {
	Port int `yaml:"port"`
}

type RedisConfig struct {
	TTl      time.Duration `yaml:"ttl"`
	Timeout  time.Duration `yaml:"timeout"`
	Address  string
	Password string
}

func MustLoadConfig() *Config {
	var cfg = &Config{}
	configPath, pass := mustLoadEnv()

	err := cleanenv.ReadConfig(configPath, cfg)
	if err != nil {
		panic(err)
	}

	cfg.Mail.smtpPassword = pass
	cfg.Rdb.SetConfig()

	return cfg
}

func (r *RedisConfig) SetConfig() {
	r.Address = os.Getenv("REDIS_ADDRESS")
	r.Password = os.Getenv("REDIS_PASSWORD")
}

func mustLoadEnv() (string, string) {
	const op = "Config.MustLoadEnv"

	err := godotenv.Load()
	if err != nil {
		panic(fmt.Errorf("%s: %s", op, err.Error()))
	}
	return os.Getenv("CONFIG_PATH"), os.Getenv("SMTP_PASSWORD")
}

func (c *Config) Password() string {
	return c.Mail.smtpPassword
}
