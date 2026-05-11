/**
 * 游戏动画与特效工具
 * 忽了个悠 - 反诈小游戏
 */

export class GameEffects {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * 屏幕震动效果
   */
  screenShake(intensity = 10, duration = 200) {
    this.scene.cameras.main.shake(duration, intensity / 1000);
  }

  /**
   * 粒子爆发效果（文字用简化版）
   */
  particleBurst(x, y, color = 0xFFD700, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const particle = this.scene.add.circle(x, y, 6, color, 0.9);
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * (80 + Math.random() * 60),
        y: y + Math.sin(angle) * (80 + Math.random() * 60),
        alpha: 0,
        scale: 0.2,
        duration: 400 + Math.random() * 300,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * 金币飞入效果（从 x1,y1 飞到 x2,y2）
   */
  coinFly(count = 3, fromX, fromY, toX, toY, onComplete) {
    let completed = 0;
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 40;
      const offsetY = (Math.random() - 0.5) * 40;
      const coin = this.scene.add.text(fromX + offsetX, fromY + offsetY, '🪙', { fontSize: '24px' });
      
      this.scene.tweens.add({
        targets: coin,
        x: toX,
        y: toY,
        alpha: 0,
        scale: 0.3,
        duration: 500 + Math.random() * 200,
        ease: 'Back.easeIn',
        delay: i * 80,
        onComplete: () => {
          coin.destroy();
          completed++;
          if (completed >= count && onComplete) onComplete();
        }
      });
    }
  }

  /**
   * 弹出窗口动画
   */
  popIn(target, duration = 300) {
    target.setScale(0);
    target.setAlpha(0);
    return this.scene.tweens.add({
      targets: target,
      scale: 1,
      alpha: 1,
      duration,
      ease: 'Back.easeOut'
    });
  }

  /**
   * 浮动提示文字
   */
  floatText(x, y, text, color = '#FFFFFF') {
    const txt = this.scene.add.text(x, y, text, {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: color,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: txt,
      y: y - 80,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => txt.destroy()
    });
  }

  /**
   * 卡片翻转动画
   */
  cardFlip(card, frontContent, backContent, duration = 500) {
    // 先缩到0
    this.scene.tweens.add({
      targets: card,
      scaleX: 0,
      duration: duration / 2,
      ease: 'Power2',
      onComplete: () => {
        // 切换到背面内容
        card.removeAll(true);
        backContent();
        // 展开
        this.scene.tweens.add({
          targets: card,
          scaleX: 1,
          duration: duration / 2,
          ease: 'Power2'
        });
      }
    });
  }

  /**
   * 箭头指示动画（引导玩家操作）
   */
  arrowGuide(x, y, direction = 'down') {
    const arrow = this.scene.add.text(x, y, '▼', {
      fontFamily: 'Arial',
      fontSize: '40px',
      color: '#D93A3A'
    }).setOrigin(0.5);

    this.scene.tweens.add({
      targets: arrow,
      y: y + (direction === 'down' ? 20 : -20),
      alpha: 0.4,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return arrow;
  }

  /**
   * 打字机效果
   */
  typewriter(textObj, fullText, speed = 30, onComplete) {
    let index = 0;
    textObj.setText('');
    
    const timer = this.scene.time.addEvent({
      delay: speed,
      callback: () => {
        index++;
        textObj.setText(fullText.substring(0, index));
        if (index >= fullText.length) {
          timer.remove();
          if (onComplete) onComplete();
        }
      },
      loop: true
    });

    return timer;
  }

  /**
   * 渐变过渡到下一场景
   */
  fadeTransition(targetScene, data = {}, duration = 500) {
    const cam = this.scene.cameras.main;
    cam.fadeOut(duration, 0, 0, 0);
    cam.once('camerafadeoutcomplete', () => {
      this.scene.scene.start(targetScene, data);
    });
  }

  /**
   * 血条/进度条动画
   */
  animateBar(graphics, x, y, width, height, fromValue, toValue, color = 0x4CAF50, duration = 800) {
    return new Promise(resolve => {
      const startVal = fromValue;
      const delta = toValue - fromValue;
      const startTime = Date.now();
      
      const updateBar = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const currentVal = startVal + delta * eased;
        
        graphics.clear();
        graphics.fillStyle(0x333333, 0.8);
        graphics.fillRoundedRect(x, y, width, height, height / 2);
        
        if (currentVal > 0) {
          const fillColor = currentVal > 0.5 ? 0x4CAF50 : (currentVal > 0.25 ? 0xFF9800 : 0xF44336);
          graphics.fillStyle(fillColor, 1);
          graphics.fillRoundedRect(x + 2, y + 2, (width - 4) * currentVal, height - 4, (height - 4) / 2);
        }
        
        if (progress < 1) {
          requestAnimationFrame(updateBar);
        } else {
          resolve();
        }
      };
      
      updateBar();
    });
  }
}
